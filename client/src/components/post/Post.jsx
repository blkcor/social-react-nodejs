import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect, useContext } from "react";
import moment from 'moment'
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'


const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentsNum, setCommentsNum] = useState(0)
  const { currentUser } = useContext(AuthContext)

  //query the number of comments 
  useEffect(() => {
    async function getComments() {
      const result = await makeRequest.get(`/comments?postId=${post.id}`)
      setCommentsNum(result.data.length)
    }
    getComments()
  }, [])

  const updateComment = (commentsNumber) => {
    setCommentsNum(commentsNumber)
  }

  const queryClient = useQueryClient()
  const { isLoading, error, data } = useQuery(['likes', post.id], () =>
    makeRequest.get(`/likes?postId=${post.id}`).then(res => {
      return res.data
    }))
  // Mutations
  const mutation = useMutation({
    mutationFn: (like) => {
      if (like)
        return makeRequest.delete(`/likes?postId=${post.id}`)
      return makeRequest.post(`/likes`, { postId: post.id })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['likes'] })
    },
  })
  // const deleteMutation = useMutation({
  //   mutationFn: (postId) => {
  //     return makeRequest(`/`)
  //   }
  // })
  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id))
  }

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={`/upload/${post.img}`} alt="" />
          <img src={`${post.img}`} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? 'Loading' : data?.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{
              color: 'red'
            }} onClick={handleLike} /> : <FavoriteBorderOutlinedIcon onClick={handleLike} />}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsNum} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments updateComment={updateComment} postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
