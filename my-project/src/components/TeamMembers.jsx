import React from 'react';
import Button from '../components/Button';
import AddTeamMembers from './AddTeamMembers';
import { useNavigate } from 'react-router-dom';
 
export default function TeamMembers() {
    const navigate = useNavigate();
  return (
    <div>
      <div className='flex justify-end items-center'>
          <Button onClick={()=>navigate("/add/teammembers")}>Add TeamMember</Button>
      </div>
      <div className='grid grid-cols-3 gap-4'>
<div className='p-4 shadow'>
    Team members
</div>
<div className='p-4 shadow'>
   Team members
</div>
      </div>
    </div>
  )
}
 