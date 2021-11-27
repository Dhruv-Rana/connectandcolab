import React, { useState, useEffect } from 'react'
import { PDFObject } from 'react-pdfobject'
import Modal from 'react-bootstrap/Modal'
import { Card, Button, Icon, Grid } from 'semantic-ui-react'
import { Search } from '@material-ui/icons'
import { InputBase } from '@material-ui/core'

import socket from '../../socket'
import UploadNotes from './UploadNotes'
import CentreButton from '../CentreButton'
import { baseUrl } from '../../config'
import axios from '../../api'

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [open, setOpen] = useState(false)
  const [noteId, setNoteId] = useState(null)

  const [searchValue, setSearchValue] = useState('')
  const [filteredNotes, setFilteredNotes] = useState([])

  useEffect(() => {
    socket.on('NOTE::NEW', (data) => {
      // console.log('NOTE::NEW :', data)
      if (data.status) {
        setNotes([data.noteData, ...notes])
        if (
          data.noteData.noteName
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        ) {
          setFilteredNotes([data.noteData, ...filteredNotes])
        }
      } else {
        // TODO: handle false
      }
    })

    return () => {
      socket.removeAllListeners('NOTE::NEW')
    }
  }, [notes, filteredNotes, searchValue])

  useEffect(() => {
    ;(async () => {
      const { data } = await axios.post('/notes/list')
      // console.log('/notes/list :', data)
      if (data.status) {
        setNotes([...data.noteData])
      } else {
        // TODO: handle false
      }
    })()
  }, [])

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value)
    setFilteredNotes(
      notes.filter((note) =>
        note.noteName.toLowerCase().includes(e.target.value.toLowerCase())
      )
    )
  }

  let displayNotes = notes
  if (searchValue !== '') {
    displayNotes = filteredNotes
  }

  return (
    <>
      <Modal show={open} backdrop={true} keyboard={false} animation={false}>
        <Modal.Body>
          <UploadNotes handleClose={setOpen} />
        </Modal.Body>
      </Modal>
      <Modal
        show={noteId !== null}
        // fullscreen={true}
        keyboard={false}
        animation={false}
        size={'lg'}
        // style={{ width: '100%' }}
        dialogClassName="modal-90w"
      >
        <Modal.Body>
          <Grid columns={1}>
            <Grid.Column>
              <Grid.Row>
                <PDFObject
                  width={'100%'}
                  height={'500px'}
                  url={baseUrl + '/notes/get/' + noteId}
                />
              </Grid.Row>
              <Grid.Row>
                <Button
                  color={'red'}
                  onClick={() => {
                    setNoteId(null)
                  }}
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '50%',
                  }}
                >
                  Close
                </Button>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Modal.Body>
      </Modal>
      <CentreButton>
        <Button
          primary
          onClick={() => setOpen(true)}
          style={{ marginBottom: 10 }}
        >
          <Icon name={'add'} /> <h4>Upload Notes</h4>
        </Button>
        <div
          className="search"
          style={{
            float: 'right',
            marginLeft: '30%',
            border: '1px solid black',
          }}
        >
          <Search />
          <InputBase
            placeholder="Search Notes..."
            className="inputBase"
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSearchChange}
          />
        </div>
      </CentreButton>

      <div
        style={{
          backgroundColor: 'whitesmoke',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: false,
        }}
      >
        {displayNotes.map((note) => {
          let noteTitle = note.noteName
          if (noteTitle.length > 100) {
            noteTitle = noteTitle.slice(0, 100) + '...'
          }
          return (
            <Card
              key={note.noteId}
              color="red"
              style={{
                width: '60%',
                display: 'flex',
              }}
            >
              <Card.Content textAlign={'center'} header={noteTitle} />
              <Card.Content>
                <Grid columns={1}>
                  <Grid.Column textAlign={'center'}>
                    <Button
                      color={'grey'}
                      variant="contained"
                      onClick={() => {
                        setNoteId(note.noteId)
                      }}
                      size={'medium'}
                      style={{ width: '80%' }}
                    >
                      View / Download Notes
                    </Button>
                  </Grid.Column>
                </Grid>
              </Card.Content>
            </Card>
          )
        })}
      </div>
      <div style={{ textAlign: 'center' }}>
        <b>Yay! You have seen it all</b>
      </div>
    </>
  )
}

export default Notes
