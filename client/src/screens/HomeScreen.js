import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Post from '../components/Post'
import Sidebar from '../components/Sidebar'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'
import { useAlert } from 'react-alert'

const HomeScreen = () => {
  const alert = useAlert()

  //States
  const [posts, setPosts] = useState([])
  const [postTitles, setPostTitles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(5)

  //UseEffect
  useEffect(() => {
    async function fetchAllPosts() {
      try {
        let fetch_posts = await axios.get('/api/fetch_posts')
        if (loading) {
          const data = Array.from(fetch_posts.data)
          setLoading(false)
          setPosts(data)
          setPostTitles(data.map((post) => [post.title, post._id]).slice(0, 6))
        }
      } catch (err) {
        const msg = err.response ? err.response.data.message : err
        alert.show(msg, { type: 'error' })
      }
    }
    fetchAllPosts()
    return () => {
      setLoading(false)
    }
  }, [])

  //Get current posts
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  //Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  //Return value
  return (
    <>
      <div className='d-flex content'>
        <div className='px-5 posts'>
          <div>
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={posts.length}
              paginate={paginate}
            />
          </div>
          {posts === null ? (
            <Loading />
          ) : (
            <Post posts={currentPosts} loading={loading} />
          )}
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={posts.length}
            paginate={paginate}
          />
        </div>
        <div className='sidebar mx-5'>
          <Sidebar postTitles={postTitles} />
        </div>
      </div>
    </>
  )
}

export default HomeScreen
