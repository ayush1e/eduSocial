import React from 'react';
import { Box, Typography } from '@mui/material';
import { School } from '@mui/icons-material';

const EduSocialLogo = ({ size = 'medium', showText = true, color = 'primary' }) => {
	const logoSize = {
		small: 32,
		medium: 48,
		large: 64
	};

	const iconSize = logoSize[size];
	const fontSize = size === 'small' ? '1.2rem' : size === 'large' ? '2rem' : '1.5rem';

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				cursor: 'pointer'
			}}
		>
			<Box
				sx={{
					width: iconSize,
					height: iconSize,
					borderRadius: '50%',
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
				}}
			>
				<School
					sx={{
						color: 'white',
						fontSize: iconSize * 0.6
					}}
				/>
			</Box>
			{showText && (
				<Typography
					variant="h6"
					sx={{
						fontWeight: 'bold',
						fontSize: fontSize,
						background: 'linear-gradient(135deg, #0c2ec7ff 0%, #071684ff 100%)',
						backgroundClip: 'text',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						fontFamily: '"Roboto", sans-serif'
					}}
				>
					eduSocial
				</Typography>
			)}
		</Box>
	);
};

export default EduSocialLogo;
