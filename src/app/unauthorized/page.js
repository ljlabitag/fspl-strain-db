
export default function UnauthorizedPage() {
    return (
        <main className="p-6 text-center justify-center items-center flex flex-col h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-red-700">403 - Unauthorized</h1>
            <p className="text-gray-700 mt-2">You do not have permission to access this page.</p>
        </main>
    );
}
