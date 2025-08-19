import React, { useEffect, useState } from 'react'
import CatalogList from './CatalogueList'
import api from '../../utils/api';
import { ErrorToast, SuccessToast } from '../../utils/Toast';
import { useDispatch } from 'react-redux';
import { getCatalog } from '../../features/catalog/catalogSlice';
import Button from '../Button';
import { FiRefreshCcw } from 'react-icons/fi';
import AddCatalogue from './AddCatalogue';
import { getMetaBusinessId } from '../../utils/custom';

const CataLogPage = () => {

    const [isLoading, setLoading] = useState(false);
    const [showAddCatalogue, setShowAddCatalogue] = useState(false); // 🔹 new state



    const handleAddCatalogue = () => {
        setShowAddCatalogue(true); // 🔹 open modal
    };

    const handleCloseAddCatalogue = () => {
        setShowAddCatalogue(false); // 🔹 close modal
    };
    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(getCatalog({ page: 1, pageSize: 10 }))
    }, [dispatch])


    const handleSyncCatalogue = async () => {
        setLoading(true);
        setTimeout(() => {

        }, 1000);

        try {
            // api/catalog/sync/:metaBusinessId
            const id = getMetaBusinessId();
            await api.get(
                `/catalog/sync/${id}`);
            SuccessToast("Catalogues synced successfully!");
            dispatch(getCatalog({ page: 1, pageSize: 10 }))

        } catch (error) {
            console.error("Error syncing Catalogues", error);
            ErrorToast("Failed to sync Catalogues");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-end gap-6">
                <Button
                    variant="secondary"
                    onClick={handleSyncCatalogue}
                    loading={isLoading}
                    disabled={isLoading}
                    icon={<FiRefreshCcw className="mr-2" />}
                    className="w-full sm:w-auto"
                >
                    Sync Catalogue
                </Button>
                <Button onClick={handleAddCatalogue} className="bg-primary-300">
                    Add Catalogue
                </Button>
            </div>

            <CatalogList />

            {/* 🔹 Render modal only if true */}
            {showAddCatalogue && (
                <AddCatalogue onClose={handleCloseAddCatalogue} />
            )}
        </>
    )
}

export default CataLogPage