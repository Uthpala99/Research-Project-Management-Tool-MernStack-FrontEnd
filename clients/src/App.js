import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./app.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/header/Header";
import {
  dispatchLogin,
  fetchUser,
  dispatchGetUser,
} from "./redux/actions/authAction";
import TopicRegistration from "./components/student/Topics/TopicRegistration";
import StudentTopicList from "./components/student/Topics/StudentTopicList";
import AllTopics from "./components/Admin/topics/TopicList";
import UpdateTopic from "./components/Admin/topics/UpdateTopic";
import MenuBar from "./components/header/MenuBar";
import NotFound from "./components/utils/NotFound/NotFound";
import Login from "./components/body/auth/Login";
import ForgotPassword from "./components/body/auth/ForgotPassword";
import ResetPassword from "./components/body/auth/ResetPassword";
import Profile from "./components/body/profile/Profile";
import ActivationEmail from "./components/body/auth/ActivationEmail";
import UserList from "./components/Admin/UserList";
import EditUser from "./components/body/profile/EditUser";
import TemplateHome from "./components/Admin/Template/TemplateHome";
import AddTemplate from "./components/Admin/Template/AddTemplate";
import EditTemplate from "./components/Admin/Template/EditTemplate";
import Register from "./components/body/auth/Register";
import DownloadTemplates from "./components/student/Template/DownloadTemplates";
import Home from "./components/Home/Home";
import GroupRegistration from "./components/student/groups/GroupRegistration";
import MutualStudent from "./components/student/groups/MutualStudent";
import GroupList from "./components/Admin/groups/GroupList";
import MyGroup from "./components/student/groups/MyGroup";
import GroupListS from "./components/student/groups/GroupListS";
import RequestFor from "./components/student/groups/RequestFor";
import AdminGroupList from "./components/Admin/groups/AdminGroupList";
import UpdateGroup from "./components/Admin/groups/UpdateGroup";
import DownloadStuSubmissions from "./components/Admin/studentsubmissions/DownloadStuSubmissions";
import EditSubmission from "./components/student/submissions/EditSubmission";
import AddSubmission from "./components/student/submissions/AddSubmission";
import StuSubmissionHome from "./components/student/submissions/StuSubmissionHome";


const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);
  const { isLogged , isAdmin , isStudent} = auth;

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const refreshtoken = sessionStorage.getItem("token");
      if (refreshtoken) {
        const getToken = async () => {
          const res = await axios.post(
            `http://localhost:5000/user/refresh_token/${refreshtoken}`,
            null
          );
          console.log(res);
          dispatch({ type: "GET_TOKEN", payload: res.data.access_token });
        };
        getToken();
      }
    }
  }, [auth.isLogged, dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin());
        return fetchUser(token).then((res) => {
          dispatch(dispatchGetUser(res));
        });
      };
      getUser();
    }
  }, [token, dispatch]);

  return (
    <Router>
      <div>
        <Header />
        <MenuBar />
        {/* user auth  routes*/}
        <Route path="/login" component={isLogged ? NotFound : Login} exact />
        <Route
          path="/register"
          component={isLogged ? NotFound : Register}
          exact
        />
        <Route
          path="/forgot_password"
          component={isLogged ? NotFound : ForgotPassword}
          exact
        />
        <Route
          path="/user/reset/:token"
          component={isLogged ? NotFound : ResetPassword}
          exact
        />
        <Route
          path="/profile"
          component={isLogged ? Profile : NotFound}
          exact
        />
        <Route
          path="/user/activate/:activation_token"
          component={ActivationEmail}
          exact
        />
        <Route
          path="/userlist"
          component={isAdmin ? UserList : NotFound}
          exact
        />
        <Route
          path="/edit_user/:id"
          component={isAdmin ? EditUser : NotFound}
          exact
        />
        {/* template routs */}
        <Route path="/template" component={isAdmin ? TemplateHome : NotFound} exact/>
        <Route path="/student/template/" component={isStudent ? DownloadTemplates : NotFound} exact/>
        <Route path="/template/add" component={isAdmin ? AddTemplate : NotFound} exact/>
        <Route path="/template/edit/:id" component={isAdmin ? EditTemplate : NotFound} exact />
      
        {/* topic management */}

        <Route
          path="/student/topic/registration"
          component={isStudent ? TopicRegistration : NotFound}
        />
        <Route
          path="/student/topic/list"
          component={isStudent ? StudentTopicList : NotFound}
        />
        <Route
          path="/admin/topic/list"
          component={isLogged ? AllTopics : NotFound}
        />
        <Route
          path="/admin/update/topic/:id"
          component={isLogged ? UpdateTopic : NotFound}
        />
        {/* group Managemnet */}
        <Route
          path="/student/group/registration"
          component={isStudent ? GroupRegistration : NotFound}
        />
        <Route
          path="/student/group/myMutuals"
          component={isStudent ? MutualStudent : NotFound}
        />
        <Route
          path="/student/group/registeredGroup"
          component={isStudent ? GroupListS : NotFound}
        />
        <Route
          path="/student/group/myGroup"
          component={isStudent ? MyGroup : NotFound}
        />
        <Route
          path="/student/group/update/:id"
          component={isStudent ? RequestFor : NotFound}
        />
        <Route
          path="/Admin/group/list/"
          component={isLogged ? AdminGroupList : NotFound}
        />
        <Route
          path="/Admin/group/update/:id"
          component={isLogged ? UpdateGroup : NotFound}
        />

        <Route path="/student/topic/registration" exact component={TopicRegistration} />
        <Route path="/student/topic/list" exact component={StudentTopicList} />
        <Route path="/admin/topic/list" exact component={AllTopics} />
        <Route path="/admin/topic/" exact component={TopicRegistration} />
        <Route path="/admin/update/topic/:id" exact component={UpdateTopic} />

        <Route path="/" exact component={Home} />
        
        <Route exact path="/submission" component={StuSubmissionHome} />
        <Route path="/submission/add" component={AddSubmission} />
        <Route path="/submission/edit/:id" component={EditSubmission} />
        <Route path="/admin/view_submissions" component={DownloadStuSubmissions} />
      </div>
    </Router>
  );
};

export default App;
