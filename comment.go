package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"path/filepath"
	"time"
)

type savedComment struct {
	Comment   string `json:"comment"`
	Timestamp int32  `json:"timestamp"`
	ID        int    `json:"id"`
}

type savedComments []savedComment

func getFileContents(path string) []byte {
	contents, err := ioutil.ReadFile(path)
	if err != nil {
		return []byte{'[', ']'}
	}

	return contents
}

func readComments(path string) savedComments {
	contents := getFileContents(path)
	cmts := make(savedComments, 0)
	err := json.Unmarshal(contents, &cmts)
	if err != nil {
		return savedComments{}
	}

	return cmts
}

func writeComments(path string, cmts savedComments) {
	data, err := json.Marshal(cmts)
	if err != nil {
		panic(err)
	}

	err = ioutil.WriteFile(path, data, 0600)
	if err != nil {
		panic(err)
	}
}

func makeSavedComment(cmt comment, cmts savedComments) savedComment {
	return savedComment{
		Comment:   cmt.Comment,
		Timestamp: int32(time.Now().Unix()),
		ID:        len(cmts) + 1,
	}
}

func addComment(cmt comment, opts options) {
	path := filepath.Join(opts.commentsFolder, fmt.Sprintf("%s.json", cmt.GhostbookID))

	cmts := readComments(path)
	// TODO:  Check for duplicates
	cmts = append(savedComments{makeSavedComment(cmt, cmts)}, cmts...)
	writeComments(path, cmts)
}
