import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateInterviewStep } from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateCandidateStep = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        const { newStepId } = req.body;

        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'ID de candidato inválido' });
        }

        if (!newStepId || isNaN(newStepId)) {
            return res.status(400).json({ error: 'Se requiere un ID de etapa válido' });
        }

        const result = await updateCandidateInterviewStep({
            candidateId,
            newStepId
        });

        res.json({
            message: 'Etapa del candidato actualizada exitosamente',
            data: result
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

export { addCandidate };