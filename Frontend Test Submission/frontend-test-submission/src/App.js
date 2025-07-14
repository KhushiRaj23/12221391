import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, TextField, Grid, Paper, Alert, Stack as MuiStack } from '@mui/material';
import { Log } from './logger';

const MAX_URLS = 5;

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function saveShortUrlMapping(shortcode, originalUrl) {
  const key = 'shortUrlMappings';
  let mappings = {};
  try {
    mappings = JSON.parse(localStorage.getItem(key)) || {};
  } catch {}
  mappings[shortcode] = originalUrl;
  localStorage.setItem(key, JSON.stringify(mappings));
}

function getShortUrlMapping(shortcode) {
  const key = 'shortUrlMappings';
  try {
    const mappings = JSON.parse(localStorage.getItem(key)) || {};
    return mappings[shortcode];
  } catch {
    return undefined;
  }
}

function UrlShortenerPage() {
  const [inputs, setInputs] = useState([
    { url: '', validity: '', shortcode: '' },
  ]);
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [token] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyZWFsa2h1c2hpMjMwMzIwMDNAZ21haWwuY29tIiwiZXhwIjoxNzUyNDczMzQwLCJpYXQiOjE3NTI0NzI0NDAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJhMzNiZjdjNS1jOWViLTRkNDItYTJlOS01YjYyM2I4N2E1OGMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJraHVzaGkgcmFqIiwic3ViIjoiZDU0ZGMzZTktMDg3Ny00MmVmLWE3YWItMjU2YTUyMDdiYTNmIn0sImVtYWlsIjoicmVhbGtodXNoaTIzMDMyMDAzQGdtYWlsLmNvbSIsIm5hbWUiOiJraHVzaGkgcmFqIiwicm9sbE5vIjoiMTIyMjEzOTEiLCJhY2Nlc3NDb2RlIjoiQ1p5cFFLIiwiY2xpZW50SUQiOiJkNTRkYzNlOS0wODc3LTQyZWYtYTdhYi0yNTZhNTIwN2JhM2YiLCJjbGllbnRTZWNyZXQiOiJCbUd4V2dud3pyQ0tWc3NCIn0.iYGnamTOsfTNAkBZ_gQyXGvTg4L0ij38neOY_Bh1jSk');

  const handleInputChange = (idx, field, value) => {
    const newInputs = [...inputs];
    newInputs[idx][field] = value;
    setInputs(newInputs);
  };

  const addInput = () => {
    if (inputs.length < MAX_URLS) {
      setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const removeInput = (idx) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, i) => i !== idx));
    }
  };

  const validateInputs = () => {
    const errs = inputs.map((input) => {
      let err = {};
      if (!input.url || !isValidUrl(input.url)) {
        err.url = 'Invalid URL';
      }
      if (input.validity && (!/^[0-9]+$/.test(input.validity) || parseInt(input.validity) <= 0)) {
        err.validity = 'Validity must be a positive integer (minutes)';
      }
      if (input.shortcode && !/^[a-zA-Z0-9_-]{3,}$/.test(input.shortcode)) {
        err.shortcode = 'Shortcode must be at least 3 characters, alphanumeric, dash or underscore';
      }
      return err;
    });
    setErrors(errs);
    return errs.every((e) => Object.keys(e).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      await Log('frontend', 'warn', 'page', 'Validation failed on URL shortener form', token);
      return;
    }
    setSubmitting(true);
    setResults([]);
    try {
      // Simulate API call and result
      const res = inputs.map((input, idx) => {
        const code = input.shortcode || Math.random().toString(36).slice(2, 8);
        saveShortUrlMapping(code, input.url);
        return {
          original: input.url,
          short: `http://localhost:3000/s/${code}`,
          expires: new Date(Date.now() + 1000 * 60 * (input.validity ? parseInt(input.validity) : 30)).toLocaleString(),
        };
      });
      setResults(res);
      await Log('frontend', 'info', 'page', 'Shortened URLs successfully', token);
    } catch (err) {
      await Log('frontend', 'error', 'page', 'Failed to shorten URLs', token);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Shorten URLs</Typography>
      <form onSubmit={handleSubmit}>
        <MuiStack spacing={2}>
          {inputs.map((input, idx) => (
            <Box key={idx} sx={{ border: '1px solid #eee', borderRadius: 2, p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Long URL"
                    value={input.url}
                    onChange={e => handleInputChange(idx, 'url', e.target.value)}
                    fullWidth
                    error={!!(errors[idx] && errors[idx].url)}
                    helperText={errors[idx] && errors[idx].url}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Validity (min)"
                    value={input.validity}
                    onChange={e => handleInputChange(idx, 'validity', e.target.value)}
                    fullWidth
                    error={!!(errors[idx] && errors[idx].validity)}
                    helperText={errors[idx] && errors[idx].validity}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Custom Shortcode"
                    value={input.shortcode}
                    onChange={e => handleInputChange(idx, 'shortcode', e.target.value)}
                    fullWidth
                    error={!!(errors[idx] && errors[idx].shortcode)}
                    helperText={errors[idx] && errors[idx].shortcode}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button color="error" onClick={() => removeInput(idx)} disabled={inputs.length === 1}>Remove</Button>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button onClick={addInput} disabled={inputs.length >= MAX_URLS}>Add URL</Button>
          <Button type="submit" variant="contained" disabled={submitting}>Shorten</Button>
        </MuiStack>
      </form>
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Shortened URLs</Typography>
          {results.map((r, i) => (
            <Alert key={i} severity="success" sx={{ mt: 2 }}>
              <div><b>Original:</b> {r.original}</div>
              <div><b>Short:</b> <a href={r.short}>{r.short}</a></div>
              <div><b>Expires:</b> {r.expires}</div>
            </Alert>
          ))}
        </Box>
      )}
    </Paper>
  );
}

function StatisticsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyZWFsa2h1c2hpMjMwMzIwMDNAZ21haWwuY29tIiwiZXhwIjoxNzUyNDczMzQwLCJpYXQiOjE3NTI0NzI0NDAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJhMzNiZjdjNS1jOWViLTRkNDItYTJlOS01YjYyM2I4N2E1OGMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJraHVzaGkgcmFqIiwic3ViIjoiZDU0ZGMzZTktMDg3Ny00MmVmLWE3YWItMjU2YTUyMDdiYTNmIn0sImVtYWlsIjoicmVhbGtodXNoaTIzMDMyMDAzQGdtYWlsLmNvbSIsIm5hbWUiOiJraHVzaGkgcmFqIiwicm9sbE5vIjoiMTIyMjEzOTEiLCJhY2Nlc3NDb2RlIjoiQ1p5cFFLIiwiY2xpZW50SUQiOiJkNTRkYzNlOS0wODc3LTQyZWYtYTdhYi0yNTZhNTIwN2JhM2YiLCJjbGllbnRTZWNyZXQiOiJCbUd4V2dud3pyQ0tWc3NCIn0.iYGnamTOsfTNAkBZ_gQyXGvTg4L0ij38neOY_Bh1jSk');

  React.useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call with mock data
        const mockStats = [
          {
            short: 'http://localhost:3000/s/abc123',
            original: 'https://example.com/long-url',
            created: new Date(Date.now() - 3600 * 1000).toLocaleString(),
            expires: new Date(Date.now() + 1800 * 1000).toLocaleString(),
            clicks: 3,
            clickDetails: [
              { ts: new Date(Date.now() - 3500 * 1000).toLocaleString(), src: 'browser', loc: 'IN' },
              { ts: new Date(Date.now() - 2000 * 1000).toLocaleString(), src: 'mobile', loc: 'US' },
              { ts: new Date(Date.now() - 100 * 1000).toLocaleString(), src: 'browser', loc: 'IN' },
            ]
          },
          {
            short: 'http://localhost:3000/s/xyz789',
            original: 'https://another.com/page',
            created: new Date(Date.now() - 7200 * 1000).toLocaleString(),
            expires: new Date(Date.now() + 600 * 1000).toLocaleString(),
            clicks: 1,
            clickDetails: [
              { ts: new Date(Date.now() - 500 * 1000).toLocaleString(), src: 'browser', loc: 'FR' },
            ]
          }
        ];
        setStats(mockStats);
        await Log('frontend', 'info', 'page', 'Loaded statistics page', token);
      } catch (err) {
        setError('Failed to load statistics');
        await Log('frontend', 'error', 'page', 'Failed to load statistics', token);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [token]);

  if (loading) return <Paper sx={{ p: 3 }}><Typography>Loading...</Typography></Paper>;
  if (error) return <Paper sx={{ p: 3 }}><Typography color="error">{error}</Typography></Paper>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Shortened URL Statistics</Typography>
      {stats.length === 0 && <Typography>No URLs shortened yet.</Typography>}
      <MuiStack spacing={3}>
        {stats.map((stat, idx) => (
          <Box key={idx} sx={{ border: '1px solid #eee', borderRadius: 2, p: 2 }}>
            <Typography><b>Short URL:</b> <a href={stat.short}>{stat.short}</a></Typography>
            <Typography><b>Original URL:</b> {stat.original}</Typography>
            <Typography><b>Created:</b> {stat.created}</Typography>
            <Typography><b>Expires:</b> {stat.expires}</Typography>
            <Typography><b>Total Clicks:</b> {stat.clicks}</Typography>
            <Typography sx={{ mt: 1 }}><b>Click Details:</b></Typography>
            <ul>
              {stat.clickDetails.map((cd, i) => (
                <li key={i}>
                  <span><b>Time:</b> {cd.ts} </span>
                  <span><b>Source:</b> {cd.src} </span>
                  <span><b>Location:</b> {cd.loc}</span>
                </li>
              ))}
            </ul>
          </Box>
        ))}
      </MuiStack>
    </Paper>
  );
}

function RedirectHandler() {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyZWFsa2h1c2hpMjMwMzIwMDNAZ21haWwuY29tIiwiZXhwIjoxNzUyNDczMzQwLCJpYXQiOjE3NTI0NzI0NDAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJhMzNiZjdjNS1jOWViLTRkNDItYTJlOS01YjYyM2I4N2E1OGMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJraHVzaGkgcmFqIiwic3ViIjoiZDU0ZGMzZTktMDg3Ny00MmVmLWE3YWItMjU2YTUyMDdiYTNmIn0sImVtYWlsIjoicmVhbGtodXNoaTIzMDMyMDAzQGdtYWlsLmNvbSIsIm5hbWUiOiJraHVzaGkgcmFqIiwicm9sbE5vIjoiMTIyMjEzOTEiLCJhY2Nlc3NDb2RlIjoiQ1p5cFFLIiwiY2xpZW50SUQiOiJkNTRkYzNlOS0wODc3LTQyZWYtYTdhYi0yNTZhNTIwN2JhM2YiLCJjbGllbnRTZWNyZXQiOiJCbUd4V2dud3pyQ0tWc3NCIn0.iYGnamTOsfTNAkBZ_gQyXGvTg4L0ij38neOY_Bh1jSk');

  React.useEffect(() => {
    async function handleRedirect() {
      setLoading(true);
      setError(null);
      try {
        // Simulate lookup (replace with real API call if available)
        let url = getShortUrlMapping(shortcode);
        if (!url) {
          // fallback to mockDb for demo
          const mockDb = {
            'abc123': 'https://example.com/long-url',
            'xyz789': 'https://another.com/page',
          };
          url = mockDb[shortcode];
        }
        if (url) {
          await Log('frontend', 'info', 'route', `Redirecting shortcode ${shortcode} to ${url}`, token);
          window.location.replace(url);
        } else {
          setError('Short URL not found.');
          await Log('frontend', 'warn', 'route', `Shortcode ${shortcode} not found`, token);
        }
      } catch (err) {
        setError('Error during redirection.');
        await Log('frontend', 'error', 'route', `Error redirecting shortcode ${shortcode}`, token);
      } finally {
        setLoading(false);
      }
    }
    handleRedirect();
  }, [shortcode, token]);

  if (loading) return <Paper sx={{ p: 3 }}><Typography>Redirecting...</Typography></Paper>;
  if (error) return <Paper sx={{ p: 3 }}><Typography color="error">{error}</Typography></Paper>;
  return null;
}

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">Shortener</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<UrlShortenerPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/s/:shortcode" element={<RedirectHandler />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
