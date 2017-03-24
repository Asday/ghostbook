package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"path/filepath"

	"github.com/davecgh/go-spew/spew"
)

type comment struct {
	GhostbookID string `json:"ghostbookId"`
	Comment     string `json:"comment"`
}

type comments []comment

func getFileContents(path string) []byte {
	contents, err := ioutil.ReadFile(path)
	if err != nil {
		return []byte{'[', ']'}
	}

	return contents
}

func readComments(path string) comments {
	contents := getFileContents(path)
	cmts := make(comments, 0)
	err := json.Unmarshal(contents, &cmts)
	if err != nil {
		return comments{}
	}

	return cmts
}

func addComment(cmt comment, opts options) {
	path := filepath.Join(opts.commentsFolder, fmt.Sprintf("%s.json", cmt.GhostbookID))

	cmts := readComments(path)

	spew.Dump(cmts)
}
