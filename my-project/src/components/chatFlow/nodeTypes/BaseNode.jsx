import { Handle, Position } from '@xyflow/react';
import React from 'react';
import CustomHandle from '../feature/CustomHandle';

const BaseNode = ({
    title = 'Node Title',
    body,
    footer,
    className = '',
    style = {},
    showHandles = true,
    handleStyle = {},
}) => {
    return (
        <div
            className={`rounded bg-primary shadow-md border border-border text-text ${className}`}
            style={{
                width: 160,
                height: 180, // ✅ fix: use lowercase 'height'
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                ...style,
            }}
        >

            <div className=" bg-primary-700  text-white text-sm font-semibold p-2 border-b border-border">
                {title}
            </div>

            <div className="flex-1 p-3 text-sm">{body}</div>

            {footer && <div className="p-2 border-t border  border-border text-xs text-text">{footer}</div>}

            {showHandles && (
                <>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: -0,
                            left: 0,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <CustomHandle
                            type="target"
                            position={Position.Bottom}
                            id="next"
                            label="Next"
                            style={{
                                background: '#1A475F',
                                width: 10,
                                height: 10,
                            }}
                            connectionCount={3}
                        />
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            display: 'flex',
                        }}
                    >
                        <CustomHandle
                            type="source"
                            position={Position.Bottom}
                            id="reply"
                            style={{
                                background: '#1A475F',
                                width: 10,
                                height: 10,
                            }}
                            connectionCount={3}
                        />
                    </div>
                </>
            )}


        </div>
    );
};

export default BaseNode;
