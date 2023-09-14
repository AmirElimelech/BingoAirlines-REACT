import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axiosUtils';
import './TopBar.css';
import logo from '../../assets/images/BingoAirlinesLogo.png'; 
import UserContext from '../../contexts/UserContext';
import DropDown from './DropDown';

const TopBar = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [userImageUrl, setUserImageUrl] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    console.log("User Role in TopBar:", user?.user_role); 

    const isLoggedIn = !!user;

    const navigateToProfileUpdate = () => {
        if (user?.user_role === "Customer") {
            navigate('/update-profile');
        } else {
            console.log("Only customers can update their profile.");
        }
    };

    useEffect(() => {
        if (user) {
            // axiosInstance.get(`http://127.0.0.1:8000/Api/user/${user.id}/image_url/`)
            axiosInstance.get(`https://bingoairlines.com/Api/user/${user.id}/image_url/`)
            .then(response => {
                // setUserImageUrl(`http://127.0.0.1:8000${response.data.image_url}`);
                setUserImageUrl(`https://bingoairlines.com${response.data.image_url}`);
            })
            .catch(error => {
                console.error("Error fetching user image:", error);
            });
        } else {
            setUserImageUrl(null);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            // await axiosInstance.get('http://127.0.0.1:8000/Api/logout_view_api/', {
            await axiosInstance.get('https://bingoairlines.com/Api/logout_view_api/', {
                withCredentials: true,
            });
            setUser(null);
            navigate('/');
        } catch (err) {
            console.error("Error during logout:", err);
        }
    };

    return (
        <div className="top-bar">
            <Link to="/">
                <img src={logo} alt="Bingo Airlines" className="top-bar-logo"/>
            </Link>
            {isLoggedIn ? 
                <>
                    <span>Welcome Back {user.username} !</span>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                    {userImageUrl && 
                        <div className="user-interaction-wrapper"
                             onMouseOver={() => setShowDropdown(true)}
                             onMouseLeave={() => setShowDropdown(false)}>
                            <div className="user-image-wrapper">
                                <img 
                                    src={userImageUrl} 
                                    alt="User Profile" 
                                    className="user-image" 
                                    onClick={user?.user_role === "Customer" ? navigateToProfileUpdate : null} 
                                />
                            </div>
                            {showDropdown && <DropDown userRole={user.user_role} />}
                        </div>
                    }
                </> : 
                <Link to="/login"> Login/Register </Link>   
            }
        </div>
    );
}

export default TopBar;









































