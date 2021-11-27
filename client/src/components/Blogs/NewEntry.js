import React, { useRef, useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'

import socket from '../../socket'

const NewEntry = (props) => {
  const title = useRef('')
  const theme = 'snow'

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],

      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],

      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'video'],
      [{ color: [] }, { background: [] }],

      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  }

  const formats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'align',
    'list',
    'indent',
    'size',
    'header',
    'link',
    'video',
    'color',
    'background',
    'clean',
  ]

  const { quill, quillRef } = useQuill({ theme, modules, formats })

  const handlePost = () => {
    if (title.current === '') {
      alert('Title cannot be Empty!')
      return
    }

    let quillContent = quill.root.innerHTML
    let n = quillContent.length
    let isEmpty = true

    for (let i = 0; i < n; ) {
      if (quillContent[i] === '<') {
        let j = i
        while (j < n && quillContent[j] !== '>') {
          j += 1
        }
        i = j + 1
      } else if (quillContent[i] !== ' ') {
        isEmpty = false
        break
      } else {
        i += 1
      }
    }

    if (isEmpty) {
      alert('Content cannot be empty!')
      return
    }

    props.handlePostSubmit(title.current, quill.root.innerHTML)
  }

  const handleClose = () => {
    props.handleClose()
  }

  useEffect(() => {
    socket.on('POST::CREATE', (data) => {
      // console.log('POST::CREATE :', data)

      if (data.status) {
        props.displayNotification('success', 'Post Created', 3000)
        handleClose()
      } else {
        // TODO:
        // error from server
        // handle data validation
        props.displayNotification('error', 'Invalid Inputs', 5000)
      }
    })

    return () => {
      socket.removeAllListeners('POST::CREATE')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form className="ui form" style={{ marginLeft: '10px' }}>
      <label>
        <h3>Title of the post</h3>
      </label>
      <br />
      <input
        type="text"
        required
        style={{ width: '70%' }}
        onChange={(e) => {
          title.current = e.target.value
        }}
      />
      <h3>Content</h3>
      <div style={{ width: '96%', height: 300, marginTop: '10px' }}>
        <div ref={quillRef} />
      </div>

      <Button
        variant="contained"
        onClick={handlePost}
        style={{ marginTop: '100px', marginLeft: '10px', marginBottom: '20px' }}
      >
        Post
      </Button>
      <Button
        variant="outlined"
        style={{
          color: 'red',
          marginTop: '100px',
          marginLeft: '20px',
          marginBottom: '20px',
        }}
        startIcon={<DeleteIcon />}
        onClick={handleClose}
      >
        Cancel
      </Button>
    </form>
  )
}

export default NewEntry
