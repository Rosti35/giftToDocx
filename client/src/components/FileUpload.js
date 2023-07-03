import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Button, CircularProgress, Snackbar } from '@mui/material';
import { css } from '@emotion/react';

function Alert(props) {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={6000}
      onClose={props.onClose}
    >
      <div css={css`
        background-color: ${props.severity === 'success' ? '#4caf50' : '#f44336'};
        color: white;
      `}>
        {props.message}
      </div>
    </Snackbar>
  );
}

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const { getAccessTokenSilently } = useAuth0();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    setLoading(true);
    const token = await getAccessTokenSilently();
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('YOUR_BACKEND_ENDPOINT', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessage('File uploaded successfully!');
      setSeverity('success');
    } catch (error) {
      setMessage('File upload failed!');
      setSeverity('error');
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleFileUpload}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          'Upload'
        )}
      </Button>
      <Alert
        onClose={handleClose}
        severity={severity}
        message={message}
      />
    </div>
  );
};

export default FileUpload;
