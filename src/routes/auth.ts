import express, { Request, Response } from 'express';
import User, {IUser } from '@/models/User';
import { hashPassword, comparePassword } from '@/utils/auth';
import { generateToken } from '@/utils/jwt'
import { asyncWrapper } from '@/utils/asyncWrapper';

const router = express.Router();

router.post('/register', asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            res.status(400).json({ message: 'User already exists'});
            return;
        }
        const hashedPassword = await hashPassword(password);
    
        const user: IUser = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    })
);   

router.post('/login', asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
       res.status(400).json({ message: "Invalid email or password" });
       return;
    }

    const token = generateToken(user.id);

    res.status(200).json({ token });
}))

export default router;
