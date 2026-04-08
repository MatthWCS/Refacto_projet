import { AdventureModel } from "../models/AdventureModel";
import { UserModel } from "../models/UserModel";
import { generateUniqueSlug } from "../utils/slugGenerator";

export class AdventureController {

    static async list(req, res) {
        try {
            const adventures = await AdventureModel.findAll()

            res.status(200).json({
                message: "Adventures fetched",
                adventures
            })
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" })
        }
    }

    static async one(req, res) {

        try {
            const { id } = req.params
            const adventure = await AdventureModel.findByPk(id)

            if (!adventure) {
                return res.status(404).json({ message: "Adventure not found." })
            }

            res.status(200).json({
                message: "Adventure fetched",
                adventure
            })
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" })
        }
    }

    static async create(req, res) {

        try {

            const { title, description } = req.body


            // verifier la longueur du champ sinon plantage avec erreur SQL
            if (!title || !description) {
                return res.status(400).json({ message: "Title and description required." })
            }

            if (title.length > 30) {
                return res.status(400).json({ message: "The title must not exceed 30 characters." })
            }

            const slug = await generateUniqueSlug(title)
            const user = await UserModel.findById({ id: req.user.id })

            const addedAdventure = await AdventureModel.create({
                title,
                description,
                slug,
                created_by_user_id: user.id,
                starting_paragraph_id: null
            })

            res.status(201).json({
                message: "Adventure created successfully",
                addedAdventure
            })

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }

    }

    static async update(req, res) {

        try {
            const adventure = await AdventureModel.findByPk(req.params.id)
            if (!adventure) {
                return res.status(404).json({ message: "Aventure not found." })
            }

            await AdventureModel.update({ id: req.params.id, ...req.body })
            res.status(200).json({ message: "Adventure updated successfully." })

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }

    static async remove(req, res) {

        try {
            const adventure = await AdventureModel.findByPk(req.params.id)
            if (!adventure) {
                return res.status(404).json({ message: "Aventure not found." })
            }

            await AdventureModel.remove(req.params.id)
            res.status(200).json({ message: "Adventure deleted successfully." })

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }
    }
}