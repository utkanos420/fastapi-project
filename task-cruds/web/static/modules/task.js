export async function getTasks() {
    const response = await fetch('http://127.0.0.1:2223/api/v1/tasks/');
    return await response.json();
}