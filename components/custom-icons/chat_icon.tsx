import React from 'react';
import type { SVGProps } from 'react';

export function ChatIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} viewBox="0 0 32 32" {...props}><path fill="currentColor" d="M28 2H18c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2.4l1.7 3l1.7-1l-2.3-4H18V4h10v6h-3v2h3c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M14.7 31L13 30l3.5-6H22c1.1 0 2-.9 2-2v-5h2v5c0 2.2-1.8 4-4 4h-4.4z"></path><circle cx={10} cy={17} r={1} fill="currentColor"></circle><circle cx={14} cy={17} r={1} fill="currentColor"></circle><circle cx={18} cy={17} r={1} fill="currentColor"></circle><path fill="currentColor" d="M12 26H6c-2.2 0-4-1.8-4-4V12c0-2.2 1.8-4 4-4h8v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6z"></path></svg>);
}