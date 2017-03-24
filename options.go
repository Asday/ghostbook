package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// TODO:  This code feels like it sucks compared to `handlers.go`.

type options struct {
	commentsFolder     string
	commentLengthLimit int
	port               int
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

func getOptions() (options, error) {
	commentsFolder := os.Getenv("GB_COMMENTS_FOLDER")
	commentLengthLimit := os.Getenv("GB_COMMENT_LENGTH_LIMIT")
	port := os.Getenv("GB_PORT")

	errs := make([]string, 0)
	optSetters := make([]option, 0)

	if commentsFolder != "" {
		mkdirErr := os.MkdirAll(commentsFolder, 0700)
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
		errs = append(errs, "Environment variable GB_COMMENTS_FOLDER must be set.")
	}

	if commentLengthLimit != "" {
		if commentLengthLimit, err := strconv.Atoi(commentLengthLimit); err == nil {
			if commentLengthLimit <= 0 {
				errs = append(errs, "Please define GB_COMMENT_LENGTH_LIMIT as a positive integer.")
			} else {
				optSetters = append(optSetters, optionCommentLengthLimit(commentLengthLimit))
			}
		} else {
			errs = append(errs, fmt.Sprintf("Unable to convert environment variable GB_COMMENT_LENGTH_LIMIT to an int:  %s", err.Error()))
		}
	} else {
		errs = append(errs, "Environment variable GB_COMMENT_LENGTH_LIMIT must be set.")
	}

	if port != "" {
		if port, err := strconv.Atoi(port); err == nil {
			optSetters = append(optSetters, optionPort(port))
		} else {
			errs = append(errs, fmt.Sprintf("Unable to convert environment variable GB_PORT to an int:  %s", err.Error()))
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
