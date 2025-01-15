import React from 'react';
import { Box, Typography, IconButton, Avatar, Chip } from '@mui/material';
import { Close } from '@mui/icons-material';

interface CompatibilityDetailsProps {
  profile: any;
  onClose?: () => void;
}

const CompatibilityDetails: React.FC<CompatibilityDetailsProps> = ({ profile, onClose }) => {
  return (
    <Box sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span role="img" aria-label="heart">❤️</span>
          <Typography variant="h6">Compatibility Analysis</Typography>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Profile Info */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
          <Avatar
            src={profile.avatar_url}
            sx={{ width: 120, height: 120 }}
          />
          <Box>
            <Typography variant="h6" gutterBottom>
              Sarah Chen, 28
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <span role="img" aria-label="heart">❤️</span>
              <Typography color="error.main" fontWeight="bold">
                95% Compatible
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="Creative" variant="outlined" size="small" />
              <Chip label="Ambitious" variant="outlined" size="small" />
              <Chip label="Empathetic" variant="outlined" size="small" />
            </Box>
          </Box>
        </Box>

        {/* Relationship Dynamics */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <span role="img" aria-label="sparkles">✨</span>
            <Typography variant="h6">Relationship Dynamics</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Strengths */}
            <Box sx={{ flex: 1, bgcolor: '#E8F5E9', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ color: '#2E7D32', mb: 1 }}>
                <span role="img" aria-label="check">✓</span> Strengths
              </Typography>
              <Box component="ol" sx={{ m: 0, pl: 3, color: '#2E7D32' }}>
                <Typography component="li">Complementary communication styles enhance understanding</Typography>
                <Typography component="li">Shared intellectual curiosity promotes growth</Typography>
                <Typography component="li">Similar values in relationship goals</Typography>
              </Box>
            </Box>

            {/* Growth Areas */}
            <Box sx={{ flex: 1, bgcolor: '#FFF3E0', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ color: '#E65100', mb: 1 }}>
                <span role="img" aria-label="warning">⚠️</span> Growth Areas
              </Typography>
              <Box component="ol" sx={{ m: 0, pl: 3, color: '#E65100' }}>
                <Typography component="li">Different approaches to conflict resolution</Typography>
                <Typography component="li">Varying social energy levels</Typography>
                <Typography component="li">Distinct ways of showing affection</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Building Connection */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <span role="img" aria-label="heart">❤️</span>
            <Typography variant="h6">Building Connection</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>Positive Dynamics</Typography>
              <Box component="ul" sx={{ m: 0, pl: 3 }}>
                <Typography component="li">Both value deep conversations</Typography>
                <Typography component="li">Mutual respect for independence</Typography>
                <Typography component="li">Shared interest in personal growth</Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>Growth Opportunities</Typography>
              <Box component="ul" sx={{ m: 0, pl: 3 }}>
                <Typography component="li">Learning to appreciate different love languages</Typography>
                <Typography component="li">Finding balance in social activities</Typography>
                <Typography component="li">Developing shared routines</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Personalized Recommendations */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <span role="img" aria-label="gift">🎁</span>
            <Typography variant="h6">Personalized Recommendations</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Focus on understanding each other's communication styles and emotional needs. Your complementary traits create a strong foundation for a lasting connection.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CompatibilityDetails; 