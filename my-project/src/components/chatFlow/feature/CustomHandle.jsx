import React from 'react';
import { Handle, useNodeConnections } from '@xyflow/react';

const CustomHandle = (props) => {
    // console.log("rpops", props);
    const connections = useNodeConnections({
        handleType: props.type,
    });

    return (
        <Handle    className='bg-primary-400 '
            {...props}
            isConnectable={(connections.length < (props.connectionCount ?? 3))}
        />

    );
};

export default CustomHandle;