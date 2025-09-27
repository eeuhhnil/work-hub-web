import { useState } from 'react';
import { fetchSpaceProjectsWithMemberCount } from '~/api/spaceApi';

function ApiTest() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const testAPI = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log('Testing API...');
            const spaceId = '68cce1ab38543526813b2d43';
            const data = await fetchSpaceProjectsWithMemberCount(spaceId);
            console.log('API result:', data);
            setResult(data);
        } catch (err) {
            console.error('API error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkToken = () => {
        const token = localStorage.getItem('access_token');
        console.log('Access token exists:', !!token);
        console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'No token');
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
            
            <div className="space-y-4">
                <button 
                    onClick={checkToken}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Check Token
                </button>

                <button 
                    onClick={testAPI}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Test Projects API'}
                </button>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <h3 className="font-bold">Error:</h3>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    <h3 className="font-bold">Success! Projects found: {result.length}</h3>
                    <pre className="mt-2 text-sm overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            <div className="mt-8 p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>First, make sure you're logged in (go to /login)</li>
                    <li>Use credentials: huelinh@gmail.com / user</li>
                    <li>Come back to this page and click "Check Token"</li>
                    <li>Then click "Test Projects API"</li>
                    <li>Check browser console for detailed logs</li>
                </ol>
            </div>
        </div>
    );
}

export default ApiTest;
