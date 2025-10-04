FROM alpine:3.18
RUN apk add --no-cache ca-certificates

WORKDIR /pb

# Copy the bundled binary
COPY pocketbase/pocketbase /usr/local/bin/pocketbase

# Copy migrations (optional) and keep data dir mountable
COPY pocketbase/pb_migrations /pb/pb_migrations

VOLUME ["/pb/pb_data"]

EXPOSE 8090

ENV PB_DATA_DIR=/pb/pb_data

CMD ["/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
