package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

type comment struct {
	GhostbookID     string `json:"ghostbookId"`
	Comment         string `json:"comment"`
	CaptchaResponse string `json:"g-recaptcha-response"`
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
		errorMsg := "Comment length too long; reduce to at most %d characters"
		return fmt.Errorf(errorMsg, opts.commentLengthLimit)
	}

	if opts.captchaEnabled() {
		if opts.captchaSecret.VerifyResponse(body.CaptchaResponse) {
			return errors.New("CAPTCHA verification failed")
		}
	}

	addComment(body, opts)

	return nil
}

type handler func(w http.ResponseWriter, r *http.Request)

func makeCommentEndpoint(opts options) handler {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Origin", opts.siteHost)

		switch r.Method {
		case "OPTIONS":
			return
		case "POST":
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

func makeCaptchaEndpoint(opts options) handler {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		switch r.Method {
		case "OPTIONS":
			return
		case "GET":
			w.WriteHeader(200)
			w.Write([]byte(opts.captchaSiteID))
		default:
			http.Error(w, "Method not allowed", 405)
		}
	}
}
