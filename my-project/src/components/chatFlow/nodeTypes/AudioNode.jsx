import React from 'react'
import BaseNode from './BaseNode'

const AudioNode = ({ data, id }) => {

    const body = (
        <>
            <button
                style={{ position: 'absolute', top: 2, right: 2, zIndex: 10 }}
                onClick={() => data.onDelete?.(id)}
                className="text-red-700 hover:text-text bg-primary-100 hover:primary-200 rounded-full w-4 h-4 flex items-center justify-center text-sm font-bold opacity-80 hover:opacity-100 transition-opacity duration-200"
                title="Delete Node"
            >
                &#x2715; {/* Unicode 'X' for a consistent look */}
            </button>
            <input
                type="file"
                accept="audio/*"
                className="nodrag w-full px-2 py-1 bg-secondary-50 border border-gray-300 rounded"
                placeholder="Upload audio file"
            />
            <p className='text-xs text-text'>Upload an audio file to send</p>
        </>
    )

    return (
        <BaseNode title='Audio' body={body} footer={"upload audio"} />
    )
}


export default AudioNode