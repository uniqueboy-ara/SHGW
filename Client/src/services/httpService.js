import axios from "axios";
import { toast } from 'react-toastify';

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

    // console.log("error", error);
  if (!expectedError) {
    //console.log("Logging the error", error);
    toast.error("An Unexpected error occured!");
    //toastr.error('Server Error','An Unexpected error occured!')
  }

  return Promise.reject(error);
});

export function setJwt(jwt) {
  axios.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt:setJwt
};
