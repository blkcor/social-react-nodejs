import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from "../../axios";
import moment from 'moment'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const Comments = ({ postId }) => {

  const [desc, setDesc] = useState('')
  const queryClient = useQueryClient()

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
  }

  const { currentUser } = useContext(AuthContext);

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
            <img src={comment.profilePic} alt="" />
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
