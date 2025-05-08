import LoggedInNavbar from '../Components/LoggedInNavbar';
import FileUpload from './FileUpload';

function LoggedInHome() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <LoggedInNavbar userEmail={user?.email} />
      <FileUpload />
      {/* Rest of the Logged-in UI here */}
    </>
  );
}

export default LoggedInHome;