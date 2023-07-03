import React from 'react';
import FileUpload from './components/FileUpload';
import AuthWrapper from './auth/authWrapper';

function App() {
  return (
    <AuthWrapper>
      <FileUpload />
    </AuthWrapper>
  );
}

export default App;
