package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/haisum/recaptcha"
)

// TODO:  This code feels like it sucks compared to `handlers.go`.

type options struct {
	siteHost           string
	commentsFolder     string
	commentLengthLimit int
	port               int
	captchaSiteID      string
	captchaSecret      recaptcha.R
}

func (o options) captchaEnabled() bool {
	return o.captchaSiteID != ""
}

type option func(*options) error

func newOptions(optionSetters ...option) (*options, error) {
	out := &options{}
	out.port = 55864

	for _, option := range optionSetters {
		err := option(out)
		if err != nil {
			return nil, err
		}
	}

	return out, nil
}

func optionSiteHost(siteHost string) option {
	return func(options *options) error {
		options.siteHost = siteHost
		return nil
	}
}

func optionCommentsFolder(commentsFolder string) option {
	return func(options *options) error {
		options.commentsFolder = commentsFolder
		return nil
	}
}

func optionCommentLengthLimit(commentLengthLimit int) option {
	return func(options *options) error {
		options.commentLengthLimit = commentLengthLimit
		return nil
	}
}

func optionPort(port int) option {
	return func(options *options) error {
		options.port = port
		return nil
	}
}

func optionCaptchaDetails(siteID string, secret string) option {
	return func(options *options) error {
		options.captchaSiteID = siteID
		options.captchaSecret = recaptcha.R{Secret: secret}
		return nil
	}
}

func getOptions() (options, error) {
	siteHost := os.Getenv("GB_SITE_HOST")
	commentsFolder := os.Getenv("GB_COMMENTS_FOLDER")
	commentLengthLimit := os.Getenv("GB_COMMENT_LENGTH_LIMIT")
	port := os.Getenv("GB_PORT")
	captchaSiteID := os.Getenv("GB_CAPTCHA_SITE_ID")
	captchaSecret := os.Getenv("GB_CAPTCHA_SECRET")

	errs := make([]string, 0)
	optSetters := make([]option, 0)

	if siteHost != "" {
		optSetters = append(optSetters, optionSiteHost(siteHost))
	} else {
		errs = append(errs, "Environment variable GB_SITE_HOST must be set")
	}

	if commentsFolder != "" {
		mkdirErr := os.MkdirAll(commentsFolder, 0775)
		path := filepath.Join(commentsFolder, "_ghostbook_write_test")
		f, writeErr := os.OpenFile(path, os.O_WRONLY|os.O_CREATE, 0600)
		f.Close() // No need to defer or check for errors.
		if mkdirErr == nil && writeErr == nil {
			optSetters = append(optSetters, optionCommentsFolder(commentsFolder))
		} else {
			errorMsg := "Environment variable GB_COMMENTS_FOLDER refers to an unwritable path"
			errs = append(errs, errorMsg)
		}
	} else {
		errs = append(errs, "Environment variable GB_COMMENTS_FOLDER must be set")
	}

	if commentLengthLimit != "" {
		if commentLengthLimit, err := strconv.Atoi(commentLengthLimit); err == nil {
			if commentLengthLimit <= 0 {
				errs = append(errs, "Please define GB_COMMENT_LENGTH_LIMIT as a positive integer")
			} else {
				optSetters = append(optSetters, optionCommentLengthLimit(commentLengthLimit))
			}
		} else {
			errs = append(errs, fmt.Sprintf("Unable to convert environment variable GB_COMMENT_LENGTH_LIMIT to an int:  %s", err.Error()))
		}
	} else {
		errs = append(errs, "Environment variable GB_COMMENT_LENGTH_LIMIT must be set")
	}

	if port != "" {
		if port, err := strconv.Atoi(port); err == nil {
			optSetters = append(optSetters, optionPort(port))
		} else {
			errs = append(errs, fmt.Sprintf("Unable to convert environment variable GB_PORT to an int:  %s", err.Error()))
		}
	}

	if (captchaSiteID != "" && captchaSecret == "") || (captchaSiteID == "" && captchaSecret != "") {
		errs = append(errs, "You must specify either both or neither of the environment variables `GB_CAPTCHA_SITE_ID` and `GB_CAPTCHA_SECRET`")
	} else if captchaSiteID != "" { // Only validate CAPTCHA details if we're to use CAPTCHA
		errorTemplate := "Your `%s` doesn't look right.  As far as I know, it should be 40 characters long"
		formatError := false
		if len(captchaSiteID) != 40 {
			errs = append(errs, fmt.Sprintf(errorTemplate, "GB_CAPTCHA_SITE_ID"))
			formatError = true
		}
		if len(captchaSecret) != 40 {
			errs = append(errs, fmt.Sprintf(errorTemplate, "GB_CAPTCHA_SECRET"))
			formatError = true
		}

		if !formatError {
			optSetters = append(optSetters, optionCaptchaDetails(captchaSiteID, captchaSecret))
		}
	}

	opts, err := newOptions(optSetters...)

	if err != nil {
		errs = append(errs, err.Error())
	}

	if len(errs) > 0 {
		return options{}, errors.New(strings.Join(errs, "\n"))
	}

	return *opts, nil
}
