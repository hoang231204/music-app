import Role from "../../models/role-model";
import { Request, Response } from "express";
//GET /admin/roles
export const index = async (req: Request, res: Response) => {
    try{
        const roles = await Role.find();
        res.json({ code: 200, data: roles });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//GET /admin/roles/create
export const create = (req: Request, res: Response) => {
    res.json({ code: 200, message: "Form tạo nhóm quyền" });
}
//POST /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    try {
        const newRole = new Role({ title, description });
        await newRole.save();
        res.json({ code: 200, message: "Tạo nhóm quyền thành công" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//GET /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
    const roleId = req.params.id;
    try {
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ code: 404, message: "Không tìm thấy nhóm quyền" });
        }
        res.json({ code: 200, data: role });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//PATCH /admin/roles/edit/:id
export const editPatch= async (req: Request, res: Response) => {
   try{
    const roleId = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    await Role.updateOne({ _id: roleId }, { title, description });
    res.json({ code: 200, message: "Cập nhật thành công" });
   }
    catch(err){
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//DELETE /admin/roles/delete/:id
export const deleteRole = async (req: Request, res: Response) => {
    try{
        const roleId = req.params.id;
        await Role.updateOne({ _id: roleId }, { deleted: true });
        res.json({ code: 200, message: "Xóa thành công" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}
//GET /admin/roles/permission
export const permission = async (req: Request, res: Response) => {
    const roles = await Role.find();
    res.json({ code: 200, data: roles });
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
        res.json({ code: 200, message: "Cập nhật phân quyền thành công" });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
    }
}