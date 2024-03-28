const jwt=require('jsonwebtoken')
const secretkey='$sE2%8N67#NO92r$dnf7j!9@3@42'

async function genToken(user)
{
    const payload={
        _id:user._id,
        username:user.username,
        email:user.email,
        role:user.role,
    }
    const token=jwt.sign(payload,secretkey)
    return token
}

function validateToken(token)
    {
        const payload=jwt.verify(token,secretkey)
        return payload
    }

module.exports={genToken,validateToken} 