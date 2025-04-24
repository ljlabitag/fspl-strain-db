'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProjectModal from '@components/manage/projectModal';
import AnnouncementModal from '@components/manage/announcementModal';

export default function ManageAdmin() {
    const [projects, setProjects] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showProjectModal, setShowProjectModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => {
        fetchProjects();
        fetchAnnouncements();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch('/api/summary');
            const data = await res.json();
            setAnnouncements(data.announcements);
        } catch (error) {
            console.error('Failed to fetch announcements:', error);
            toast.error('Failed to load announcements');
        }
    };


    const handleAddOrEditProject = async (formData) => {
        try {
            const res = await fetch(
                selectedProject ? `/api/projects/${selectedProject.project_id}` : '/api/projects',
                {
                    method: selectedProject ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }
            );

            if (res.ok) {
                toast.success(`Project ${selectedProject ? 'updated' : 'added'} successfully`);
                fetchProjects();
            } else {
                toast.error('Failed to save project');
            }
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Error saving project');
        } finally {
            setShowProjectModal(false);
            setSelectedProject(null);
        }
    };

    const handleAddOrEditAnnouncement = async (formData) => {
        try {
            const res = await fetch(
                selectedAnnouncement ? `/api/summary/announcements/${selectedAnnouncement.announcement_id}` : '/api/summary/announcements',
                {
                    method: selectedAnnouncement ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }
            );

            if (res.ok) {
                toast.success(`Announcement ${selectedAnnouncement ? 'updated' : 'added'} successfully`);
                fetchAnnouncements();
            } else {
                toast.error('Failed to save announcement');
            }
        } catch (error) {
            console.error('Error saving announcement:', error);
            toast.error('Error saving announcement');
        } finally {
            setShowAnnouncementModal(false);
            setSelectedAnnouncement(null);
        }
    };

    const handleDeleteProject = async (project_id) => {
        const confirm = window.confirm('Are you sure you want to delete this project?');
        if (!confirm) return;

        try {
            const res = await fetch(`/api/projects/${project_id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success('Project deleted successfully');
                fetchProjects();
            } else {
                toast.error('Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Error deleting project');
        }
    };

    const handleDeleteAnnouncement = async (announcement_id) => {
        const confirm = window.confirm('Are you sure you want to delete this announcement?');
        if (!confirm) return;

        try {
            const res = await fetch(`/api/summary/announcements/${announcement_id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success('Announcement deleted successfully');
                fetchAnnouncements();
            } else {
                toast.error('Failed to delete announcement');
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
            toast.error('Error deleting announcement');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-xl font-semibold">Administrative Management</h2>

            {/* Project Management */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Project Management</h3>
                    <button
                        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                        onClick={() => {
                            setSelectedProject(null);
                            setShowProjectModal(true);
                        }}
                    >
                        + Add Project
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-600">Loading projects...</p>
                ) : (
                    <table className="w-full table-auto border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Project Title</th>
                                <th className="border p-2">Funding Agency</th>
                                <th className="border p-2">Fund Code</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.project_id}>
                                    <td className="border p-2">{project.project_title}</td>
                                    <td className="border p-2">{project.funding_agency || '-'}</td>
                                    <td className="border p-2">{project.fund_code || '-'}</td>
                                    <td className="border p-2 space-x-2">
                                        <button
                                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                                            onClick={() => {
                                                setSelectedProject(project);
                                                setShowProjectModal(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="bg-red-600 text-white px-2 py-1 rounded"
                                            onClick={() => handleDeleteProject(project.project_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <ProjectModal
                isOpen={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                onSubmit={handleAddOrEditProject}
                initialData={selectedProject}
            />

            {/* Announcement Management */}
            <section className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Announcement Management</h3>
                    <button 
                        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                        onClick={() => {
                            setSelectedAnnouncement(null);
                            setShowAnnouncementModal(true);
                        }}
                    >
                        + Add Announcement
                    </button>
                </div>

                {announcements.length === 0 ? (
                    <p className="text-gray-600">No announcements found.</p>
                ) : (
                    <table className="w-full table-auto border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Title</th>
                                <th className="border p-2">Message</th>
                                <th className="border p-2">Posted</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map((item) => (
                                <tr key={item.announcement_id}>
                                    <td className="border p-2">{item.title}</td>
                                    <td className="border p-2">{item.message}</td>
                                    <td className="border p-2">{new Date(item.created_at).toLocaleString()}</td>
                                    <td className="border p-2 space-x-2">
                                        <button 
                                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                                            onClick={() => {
                                                setSelectedAnnouncement(item);
                                                setShowAnnouncementModal(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="bg-red-600 text-white px-2 py-1 rounded"
                                            onClick={() => handleDeleteAnnouncement(item.announcement_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <AnnouncementModal
                isOpen={showAnnouncementModal}
                onClose={() => setShowAnnouncementModal(false)}
                onSubmit={handleAddOrEditAnnouncement}
                initialData={selectedAnnouncement}
            />
        </div>
    );
}
