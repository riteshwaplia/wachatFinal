import { Save, Play, FileText, Download, Upload, Plus, Edit2, Check, X } from 'lucide-react';
import React from 'react';

import axios from 'axios';
// import { createFlows } from '../../apis/flows/flowApi';
import { useParams } from 'react-router-dom';
import Button from '../Button';
import api from '../../utils/api';
import { createFlowApi } from '../../apis/FlowApi';

const Toolbar = ({ onNewFlow, onTestFlow, onShowFlows, data, importFlow , setSavFlow}) => {
    const { id } = useParams()
    const { nodes, edges,flowUpdate } = data;
    const projectId = id

    
    const exportFlow = () => {
        const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'flow.json';
        a.click();
    };

    // Add this function in your Flow component


 



    return (
        <div className="bg-bg border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <h1 className="text-2xl font-bold text-text">
                        Chatbot Flow
                    </h1>

                </div>

                <div className="flex flex-row items-center justify-center space-x-3">
                    <Button
                        onClick={onNewFlow}
                        className="px-4 py-2 bg-primary-700 flex flex-row justify-center items-center text-text rounded mb-2"

                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Flow
                    </Button>

                    {/* <Button
            onClick={handleSave}
            className="flex items-center px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 
                       text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Flow
          </Button> */}

                    {/* <Button
                        onClick={onTestFlow}
                        className="flex items-center px-4 py-2 text-sm bg-green-600 hover:bg-primary-700
                       text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Test Flow
                    </Button> */}

                    {/* <Button
                        onClick={onShowFlows}
                        className="flex items-center px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 
                       text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Manage Flows
                    </Button> */}

                    <div className="h-6 w-px bg-bg"></div>

                    <Button
                        onClick={exportFlow}
                        className="px-4 py-2 bg-primary-700 text-text rounded mb-2"
                    >
                        Export Flow
                    </Button>

                    <Button className="px-4 py-2 bg-primary-700 text-text rounded mb-2"
                        onClick={setSavFlow}>
                       { flowUpdate ? "Update" :"Save to Database"}
                    </Button>

                    <label className="px-4 py-2 bg-bg hover:bg-primary-700 text-text hover:text-white border-primary-600 border-2 rounded mb-2"
                    >
                        Import Flow
                        <input
                            type="file"
                            accept="application/json"
                            onChange={importFlow}
                            style={{ display: 'none' }}
                        />

                    </label>



                </div>
            </div>
        </div>
    );
};

export default Toolbar;