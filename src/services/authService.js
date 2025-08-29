const login = async ({email, password}) => {
 try{
 const response = await fetch(`/api/auth/login`, {
 method: 'POST',
 credentials: 'include',
 headers: {
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({
 email,
 password
 })
 });
 const data = await response.json();
 if (!response.ok) {
 throw new Error(data.message);
 } else return data;
 } catch (error) {
 console.log(error);
 }
}

const logout = async () => {
 try{
 const response = await fetch(`/api/auth/logout`, {
 method: 'POST',
 credentials: 'include',
 headers: {
 'Content-Type': 'application/json'
 }
 });
 return await response.json();
 } catch (error) {
 console.log(error);
 }
}

export {
 login,
 logout
}