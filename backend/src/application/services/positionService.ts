import { Position } from '../../domain/models/Position';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CandidateInfo {
    fullName: string;
    currentInterviewStep: string;
    averageScore: number | null;
}

export const getPositionCandidates = async (positionId: number): Promise<CandidateInfo[]> => {
    try {
        const applications = await prisma.application.findMany({
            where: {
                positionId: positionId
            },
            include: {
                candidate: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                interviewStep: {
                    select: {
                        name: true
                    }
                },
                interviews: {
                    select: {
                        score: true
                    }
                }
            }
        });

        return applications.map(application => {
            const scores = application.interviews
                .map(interview => interview.score)
                .filter((score): score is number => score !== null);

            const averageScore = scores.length > 0
                ? scores.reduce((acc, score) => acc + score, 0) / scores.length
                : null;

            return {
                fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
                currentInterviewStep: application.interviewStep.name,
                averageScore: averageScore
            };
        });
    } catch (error) {
        throw new Error('Error al obtener los candidatos de la posición');
    }
};
