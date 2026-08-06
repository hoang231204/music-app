import Role from "../../models/role-model";
import { Request, Response } from "express";
//GET /admin/roles
export const index = async (req: Request, res: Response) => {
    try{
        const roles = await Role.find();
        res.render("admin/pages/roles/index", { 
            roles: roles,
            pageTitle: "Nhóm quyền",
         });
    }
    catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}