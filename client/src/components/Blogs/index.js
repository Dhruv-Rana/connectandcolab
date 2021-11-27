import * as React from 'react'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Modal from 'react-bootstrap/Modal'
import { Card, Image, Grid } from 'semantic-ui-react'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Search } from '@material-ui/icons'
import { InputBase } from '@material-ui/core'

import NewEntry from './NewEntry'
import FullPost from './FullPost'
import socket from '../../socket'

import 'bootstrap/dist/css/bootstrap.min.css'

class Blogs extends React.Component {
  state = {
    posts: [],
    open: false,
    showPost: null,
    nextPage: 1,
    searchValue: '',
    filteredPosts: [],
  }

  handleOpen = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  handleClose = () => {
    this.setState({
      open: false,
    })
  }

  handlePostSubmit = (postTitle, postBody) => {
    // console.log('emit POST::CREATE :', postTitle, postBody)
    let data = {
      postTitle,
      postBody,
    }
    socket.emit('POST::CREATE', data)
  }

  handlePostClick = (postId) => {
    this.props.modalOperations.openModal(
      <FullPost
        postId={postId}
        closePost={this.props.modalOperations.closeModal}
      />
    )
  }

  fetchPosts = () => {
    let data = {
      pageOffset: this.state.posts.length,
    }
    socket.emit('POST::LIST', data)
    // console.log(
    //   `Emitting => POST::LIST
    // data :`,
    //   data
    // )
  }

  async componentDidMount() {
    socket.on('POST::NEW', (data) => {
      // console.log('POST::NEW :', data)
      this.setState({
        posts: [data.postData, ...this.state.posts],
        pageOffset: (this.state.pageOffset + 1) % 20,
      })
      if (
        data.postData.postTitle
          .toLowerCase()
          .includes(this.state.searchValue.toLowerCase())
      ) {
        this.setState({
          filteredPosts: [data.postData, ...this.state.filteredPosts],
        })
      }
    })

    socket.on('POST::LIST', (data) => {
      // console.log('POST::LIST :', data)
      this.setState({
        posts: [...this.state.posts, ...data.posts],
        pageNumber: this.state.pageNumber + 1,
        nextPage: data.nextPage,
      })
    })

    this.fetchPosts()
  }

  componentWillUnmount() {
    socket.removeAllListeners('POST::LIST')
    socket.removeAllListeners('POST::NEW')
    // socket.removeAllListeners('POST::CREATE')
  }

  handleSearchChange = (e) => {
    this.setState({
      searchValue: e.target.value,
      filteredPosts: this.state.posts.filter((post) =>
        post.postTitle.toLowerCase().includes(e.target.value.toLowerCase())
      ),
    })
  }

  render() {
    const postId = this.state.showPost
    const open = this.state.open
    let displayPosts = this.state.posts
    if (this.state.searchValue !== '') {
      displayPosts = this.state.filteredPosts
    }

    return (
      <div
        style={{
          height: '100vh',
        }}
      >
        <Modal show={open} backdrop={true} keyboard={false} animation={false}>
          <Modal.Body>
            <NewEntry
              displayNotification={this.props.displayNotification}
              handleClose={this.handleClose}
              handlePostSubmit={this.handlePostSubmit}
            />
          </Modal.Body>
        </Modal>
        <Modal
          show={postId !== null}
          fullscreen={true}
          backdrop={true}
          keyboard={false}
          animation={false}
          style={{ width: '100%' }}
        >
          <Modal.Body>
            <FullPost postId={postId} />
          </Modal.Body>
        </Modal>
        <div
          style={{
            textAlign: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '100%',
            padding: '5px',
            height: '100%',
          }}
        >
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            onClick={this.handleOpen}
          >
            Write New Post
          </Button>
          <div
            className="search"
            style={{
              float: 'right',
              marginRight: '30%',
              border: '1px solid black',
            }}
          >
            <Search />
            <InputBase
              placeholder="Search Posts..."
              className="inputBase"
              inputProps={{ 'aria-label': 'search' }}
              onChange={this.handleSearchChange}
            />
          </div>
          <br />
          <br />
          <div
            style={{
              height: '100%',
              overflow: 'auto',
            }}
            id="scrollablePostDiv"
          >
            <InfiniteScroll
              dataLength={this.state.posts.length}
              next={this.fetchPosts}
              hasMore={this.state.nextPage !== null}
              loader={<h4>Loading...</h4>}
              endMessage={
                <div style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </div>
              }
              style={{
                backgroundColor: 'whitesmoke',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflow: false,
                height: '100%',
              }}
              scrollableTarget="scrollablePostDiv"
            >
              {displayPosts.map((post) => {
                let postTitle = post.postTitle
                if (postTitle.length > 100) {
                  postTitle = postTitle.slice(0, 100) + '...'
                }
                return (
                  <Card
                    key={post.postId}
                    color="red"
                    style={{
                      width: '60%',
                      display: 'flex',
                      marginBottom: 5,
                    }}
                  >
                    <Card.Content header={postTitle} />
                    <Card.Description>
                      <Grid columns="two">
                        <Grid.Column textAlign={'center'}>
                          <Grid.Row>
                            <Image
                              avatar={true}
                              centered={true}
                              size={'massive'}
                              src={post.user.userImage}
                              className={'p-1'}
                            />
                          </Grid.Row>
                          <Grid.Row>
                            <span
                              style={{ float: 'left' }}
                            >{`${post.user.firstName} ${post.user.lastName}`}</span>
                          </Grid.Row>
                        </Grid.Column>
                        <Grid.Column textAlign={'center'}>
                          <Grid.Row>
                            <div>
                              {moment
                                .unix(post.timeStamp / 1000)
                                .format('HH:mm DD/MM/YYYY')}
                            </div>
                          </Grid.Row>
                          <Grid.Row>
                            <Button
                              variant="contained"
                              onClick={() => this.handlePostClick(post.postId)}
                              size={'medium'}
                              style={{ width: '80%' }}
                            >
                              View Post
                            </Button>
                          </Grid.Row>
                        </Grid.Column>
                      </Grid>
                    </Card.Description>
                  </Card>
                )
              })}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    )
  }
}

export default Blogs
