import React,{useContext} from 'react';
import { AuthContext } from './../context/AuthContext';

const Profile = () =>{
  const{user,dipatch} = useContext(AuthContext)
  const [userName,setUserName] = useState();
  const getUserProfile = async () =>{
    const response = await.get('http://localhost:5000/api/products').then(res =>{
      setUserName(res.data)
    })
  }
  return(
    <div>

    </div>
  )
}
export default Profile