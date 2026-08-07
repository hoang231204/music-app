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
//GET /admin/roles/create
export const create = (req: Request, res: Response) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền",
    });
}
//POST /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    try {
        const newRole = new Role({ title, description });
        await newRole.save();
        res.redirect("/admin/roles");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}
//GET /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
    const roleId = req.params.id;
    try {
        const role = await Role.findById(roleId);
        if (!role) {
           res.redirect("/admin/roles");
        }
        res.render("admin/pages/roles/edit", {
            role: role,
            pageTitle: "Chỉnh sửa nhóm quyền",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}
//PATCH /admin/roles/edit/:id
export const editPatch= async (req: Request, res: Response) => {
   try{
    const roleId = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    await Role.updateOne({ _id: roleId }, { title, description });
    res.redirect("/admin/roles");
   }
    catch(err){
        console.error(err);
    }
}
//DELETE /admin/roles/delete/:id
export const deleteRole = async (req: Request, res: Response) => {
    try{
        const roleId = req.params.id;
        await Role.updateOne({ _id: roleId }, { deleted: true });
        res.redirect("/admin/roles");
    }
    catch(err){
        console.error(err);
    }
}
//GET /admin/roles/permission
export const permission = async (req: Request, res: Response) => {
    const roles = await Role.find();
    res.render("admin/pages/roles/permission", {
        pageTitle: "Phân quyền",
        roles: roles
    });
}
//PATCH /admin/roles/permission
export const permissionPatch = async (req: Request, res: Response) => {
    try{
        const roles = JSON.parse(req.body.permissions);
        if(roles && Array.isArray(roles)){
            for(const role of roles){
                const countPermissions = role.permissions ? role.permissions.length : 0;
                await Role.updateOne({ _id: role.id }, { permissions: role.permissions, countPermissions: countPermissions });
            }
        }
        res.redirect("/admin/roles/permissions");
    }
    catch(err){
        console.error(err);
    }
}