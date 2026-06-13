import React from 'react';
import Icon, { IconProps } from './Icon';

export default function Stop(props: IconProps): React.ReactElement {
	return (
		<Icon {...props}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="1em" height="1em">
				<path
					d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"
					fill="currentColor"
				/>
			</svg>
		</Icon>
	);
}
