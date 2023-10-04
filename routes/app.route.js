import {Router} from 'express';
import validator from 'lodash';

const router= Router();


router.get('/',(req,res)=>{
    if(!validator.isEmpty(req.body) || !validator.isEmpty(req.query)){
        return res.status(400).json(); 
    };
    res.send()
})


export default router;