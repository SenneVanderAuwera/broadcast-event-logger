-- Get Resolve and Project
resolve = Resolve()
project = resolve:GetProjectManager():GetCurrentProject()
mediaPool = project:GetMediaPool()
fu = Fusion()

-- Map common color names (case-insensitive) to DaVinci Resolve marker colors; unknowns default to Blue
local color_map = {
    red = "Red",
    blue = "Blue",
    yellow = "Yellow",
    green = "Green",
    cyan = "Cyan",
    pink = "Pink",
    magenta = "Fuchsia",
    fuchsia = "Fuchsia",
    purple = "Purple",
    violet = "Purple",
    rose = "Rose",
    lavender = "Lavender",
    sky = "Sky",
    lightblue = "Sky",
    mint = "Mint",
    lemon = "Lemon",
    orange = "Sand",
    sand = "Sand",
    brown = "Cocoa",
    cocoa = "Cocoa",
    cream = "Cream",
    white = "Cream"
}

local function marker_color(name)
    return name and color_map[name:lower():gsub("%s+", "")] or "Blue"
end

-- Multicam sequences are Multicam Clips living in the Media Pool, not project Timelines
local function collect_multicam_clips(folder, names, clips)
    names, clips = names or {}, clips or {}
    for _, clip in pairs(folder:GetClipList()) do
        if type(clip) == "userdata" and clip.GetClipProperty then
            local clip_type = clip:GetClipProperty()["Type"] or ""
            if tostring(clip_type):lower():find("multicam") then
                table.insert(names, clip:GetName())
                table.insert(clips, clip)
            end
        end
    end
    for _, subfolder in pairs(folder:GetSubFolders()) do
        collect_multicam_clips(subfolder, names, clips)
    end
    return names, clips
end

local clip_names, clips = collect_multicam_clips(mediaPool:GetRootFolder())
if #clips == 0 then
    print("No multicam clips found in the Media Pool.")
    return
end

-- Ask the user which multicam clip to add markers to
local ui = fu.UIManager
local disp = bmd.UIDispatcher(ui)
local win = disp:AddWindow({
    ID = "TimelinePicker",
    WindowTitle = "Select Multicam Clip",
    Geometry = {100, 100, 400, 120},
    ui:VGroup{
        ID = "root",
        ui:Label{
            Text = "Select the multicam clip to add markers to:"
        },
        ui:ComboBox{
            ID = "TimelineCombo"
        },
        ui:HGroup{ui:Button{
            ID = "OkButton",
            Text = "OK"
        }, ui:Button{
            ID = "CancelButton",
            Text = "Cancel"
        }}
    }
})

local items = win:GetItems()
for _, name in ipairs(clip_names) do
    items.TimelineCombo:AddItem(name)
end

local selected_clip, cancelled

function win.On.OkButton.Clicked(ev)
    selected_clip = clips[items.TimelineCombo.CurrentIndex + 1]
    disp:ExitLoop()
end
function win.On.CancelButton.Clicked(ev)
    cancelled = true
    disp:ExitLoop()
end
win.On.TimelinePicker.Close = win.On.CancelButton.Clicked

win:Show()
disp:RunLoop()
win:Hide()

if cancelled or not selected_clip then
    print("Cancelled by user.")
    return
end

local csv_path = fu:RequestFile("Select CSV file", "*.csv")
if not csv_path or csv_path == "" then
    print("No CSV file selected.")
    return
end

-- Parse a single CSV line, handling quoted fields with embedded commas
local function parse_csv_line(line)
    local fields, field, in_quotes = {}, "", false
    local i, len = 1, #line
    while i <= len do
        local c = line:sub(i, i)
        if in_quotes then
            if c == '"' and line:sub(i + 1, i + 1) == '"' then
                field, i = field .. '"', i + 1
            elseif c == '"' then
                in_quotes = false
            else
                field = field .. c
            end
        elseif c == '"' then
            in_quotes = true
        elseif c == "," then
            table.insert(fields, field)
            field = ""
        else
            field = field .. c
        end
        i = i + 1
    end
    table.insert(fields, field)
    return fields
end

-- Convert a "HH:MM:SS:FF" / "HH:MM:SS;FF" / "HH:MM:SS" timecode to a total frame count
local function timecode_to_frames(tc, fps)
    if not tc then
        return nil
    end
    local h, m, s, f = tc:gsub(";", ":"):match("^(%d+):(%d+):(%d+):(%d+)$")
    if not h then
        h, m, s = tc:match("^(%d+):(%d+):(%d+)$")
        f = 0
    end
    if not h then
        return nil
    end
    return (tonumber(h) * 3600 + tonumber(m) * 60 + tonumber(s)) * fps + tonumber(f)
end

local clip_props = selected_clip:GetClipProperty()
local fps = math.floor((tonumber(clip_props["FPS"]) or 25) + 0.5)
local start_frames = timecode_to_frames(clip_props["Start TC"] or clip_props["Start Timecode"], fps) or 0
local duration_frames = tonumber(clip_props["Frames"])
local end_frame = duration_frames and (duration_frames - 1)

local added, skipped, line_number = 0, 0, 0

for line in io.lines(csv_path) do
    line_number = line_number + 1
    if line_number > 1 and line:find("%S") then
        local fields = parse_csv_line(line)
        local color, event_name, event_desc, timecode = fields[1], fields[2], fields[3], fields[4]
        local frames = timecode_to_frames(timecode, fps)

        -- The CSV timecode may be relative to the clip, or absolute (needs the clip's start TC subtracted)
        local frame_id
        if frames then
            for _, candidate in ipairs({frames, frames - start_frames}) do
                if not frame_id and candidate >= 0 and (not end_frame or candidate <= end_frame) then
                    frame_id = candidate
                end
            end
        end

        if frame_id then
            selected_clip:AddMarker(frame_id, marker_color(color), event_name or "", event_desc or "", 1)
            added = added + 1
        else
            print(string.format("Row %d: could not place timecode '%s', skipped.", line_number, tostring(timecode)))
            skipped = skipped + 1
        end
    end
end

print(string.format("Added %d marker(s) to '%s'. Skipped %d row(s).", added, selected_clip:GetName(), skipped))
