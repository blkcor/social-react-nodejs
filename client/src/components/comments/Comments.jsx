import { useContext, useState, useEffect } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import moment from 'moment'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'

const Comments = ({ postId, updateComment }) => {

  const [desc, setDesc] = useState('')
  const queryClient = useQueryClient()

  //为什么comments组件中不需要传postId呢 ？ 
  //queryKey是用来区分每一次查询的并且缓存查询结果
  //在comments组件中  postId直接作为查询参数（url）
  //在post组件中，没有直接使用post作为查询参数，而是使用post.id作为查询参数，因此无法区分？
  //感觉是个bug，提个issue试试
  const { isLoading, error, data } = useQuery(['comments'], () =>
    makeRequest.get(`/comments?postId=${postId}`).then(res => {
      return res.data
    }))
  // Mutations
  const mutation = useMutation({
    mutationFn: (newComments) => {
      return makeRequest.post('/comments', newComments)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })

  //handleSend
  const handleSend = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId })
    setDesc('')
    updateComment(data.length + 1)
  }

  const { currentUser } = useContext(AuthContext);
  console.log(currentUser)
  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" value={desc} onChange={(e) => { setDesc(e.target.value) }} />
        <button onClick={handleSend}>Send</button>
      </div>
      {isLoading ?
        'Loading' :
        data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={"/upload/" + comment.profilePic} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createAt).fromNow()}</span>
          </div>
        ))}
    </div>
  );
};

export default Comments;
