import { Interval, type DateTime } from "luxon";

export function getRelativeDuration(start: DateTime, current: DateTime) {
	return Interval.fromDateTimes(start, current).toDuration();
}
