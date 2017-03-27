package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	opts, err := getOptions()
	if err != nil {
		os.Stderr.WriteString(err.Error())
		os.Exit(1)
	}

	if opts.captchaEnabled() {
		http.HandleFunc("/captcha", makeCaptchaEndpoint(opts))
	}
	http.HandleFunc("/comment", makeCommentEndpoint(opts))

	http.ListenAndServe(fmt.Sprintf(":%d", opts.port), nil)
}
