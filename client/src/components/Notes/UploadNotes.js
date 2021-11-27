import * as React from 'react'
import axios from '../../api'

class UploadNotes extends React.Component {
  handleSubmit = async (event) => {
    event.preventDefault()
    const file = event.target[1].files[0]
    if (file.type !== 'application/pdf') {
      alert('Please upload file in pdf format only!')
      return
    }
    if (file.size > 100000000) {
      alert('File size should not exceed 100MB!')
      return
    }
    let formData = new FormData()
    // console.log(event)
    formData.append('noteName', event.target[0].value)
    formData.append('noteDescription', 'noteDescription')
    formData.append('note', file)
    // eslint-disable-next-line no-unused-vars
    const { data } = await axios.post('/notes/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // console.log(data)
    this.props.handleClose()
  }

  handleCancel = () => {
    this.props.handleClose()
  }

  render() {
    return (
      <div style={{ marginLeft: '10px' }}>
        <h1 style={{ textAlign: 'center' }}>Add Notes</h1>
        <form
          className="ui form"
          style={{ width: '1000px', margin: '0 auto' }}
          onSubmit={this.handleSubmit}
        >
          <label>
            <h4>Subject:*</h4>
          </label>
          <br />
          <input type="text" style={{ width: '60%' }} required />
          <br />
          <br />
          <label>
            <h4>Notes File:(Please Upload file in PDF Format only)*</h4>
          </label>
          <input type="file" accept=".pdf" style={{ width: '90%' }} required />
          <br />
          <br />
          <br />

          <input
            type="submit"
            className="ui button primary"
            value="Upload"
            style={{
              marginTop: '20px',
              marginLeft: '10px',
              marginBottom: '20px',
            }}
          />
          <button
            className="ui button negative"
            style={{
              marginTop: '20px',
              marginLeft: '20px',
              marginBottom: '20px',
            }}
            onClick={() => this.handleCancel()}
          >
            Cancel
          </button>
        </form>
      </div>
    )
  }
}

export default UploadNotes
