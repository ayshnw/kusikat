import bcrypt

pw = "123456"
hashed = bcrypt.hashpw(pw.encode(), bcrypt.gensalt())
print("OK:", bcrypt.checkpw(pw.encode(), hashed))