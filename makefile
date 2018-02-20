run-server:
	GB_SITE_HOST="*" GB_COMMENTS_FOLDER="comments" GB_COMMENT_LENGTH_LIMIT=10000 \
	go run ghostbook.go comment.go handlers.go options.go
