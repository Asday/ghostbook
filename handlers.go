package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type comment struct {
	GhostbookID string `json:"ghostbookId"`
	Comment     string `json:"comment"`
}

func getBodyData(r *http.Request) (comment, error) {
	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()
	var data comment

	err := decoder.Decode(&data)
	return data, err
}

func serveRequest(r *http.Request, opts options) error {
	body, err := getBodyData(r)
	if err != nil {
		return err
	}

	if len(body.Comment) > opts.commentLengthLimit {
		errorMsg := "Comment length too long; reduce to at most %d characters."
		return fmt.Errorf(errorMsg, opts.commentLengthLimit)
	}

	return nil
}

type handler func(w http.ResponseWriter, r *http.Request)

func makeCommentEndpoint(opts options) handler {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

		switch r.Method {
		case "POST", "OPTIONS":
			err := serveRequest(r, opts)
			if err == nil {
				w.WriteHeader(204)
			} else {
				http.Error(w, err.Error(), 400)
			}
		default:
			http.Error(w, "Method not allowed", 405)
		}
	}
}
