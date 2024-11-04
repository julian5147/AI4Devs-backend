import { PrismaClient } from '@prisma/client';
import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { Resume } from '../../domain/models/Resume';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { validateCandidateData } from '../validator';

const prisma = new PrismaClient();

export const addCandidate = async (candidateData: any) => {
  try {
    validateCandidateData(candidateData); // Validar los datos del candidato
  } catch (error: any) {
    throw new Error(error);
  }

  const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
  try {
    const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
    const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

    // Guardar la educación del candidato
    if (candidateData.educations) {
      for (const education of candidateData.educations) {
        const educationModel = new Education(education);
        educationModel.candidateId = candidateId;
        await educationModel.save();
        candidate.education.push(educationModel);
      }
    }

    // Guardar la experiencia laboral del candidato
    if (candidateData.workExperiences) {
      for (const experience of candidateData.workExperiences) {
        const experienceModel = new WorkExperience(experience);
        experienceModel.candidateId = candidateId;
        await experienceModel.save();
        candidate.workExperience.push(experienceModel);
      }
    }

    // Guardar los archivos de CV
    if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
      const resumeModel = new Resume(candidateData.cv);
      resumeModel.candidateId = candidateId;
      await resumeModel.save();
      candidate.resumes.push(resumeModel);
    }
    return savedCandidate;
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint failed on the fields: (`email`)
      throw new Error('The email already exists in the database');
    } else {
      throw error;
    }
  }
};

export const findCandidateById = async (
  id: number,
): Promise<Candidate | null> => {
  try {
    const candidate = await Candidate.findOne(id); // Cambio aquí: pasar directamente el id
    return candidate;
  } catch (error) {
    console.error('Error al buscar el candidato:', error);
    throw new Error('Error al recuperar el candidato');
  }
};

export interface UpdateCandidateStepDTO {
  candidateId: number;
  newStepId: number;
}

export const updateCandidateInterviewStep = async ({
  candidateId,
  newStepId,
}: UpdateCandidateStepDTO) => {
  try {
    const application = await prisma.application.findFirst({
      where: {
        candidateId: candidateId,
      },
    });

    if (!application) {
      throw new Error('No se encontró ninguna aplicación para este candidato');
    }

    const interviewStep = await prisma.interviewStep.findUnique({
      where: {
        id: newStepId,
      },
    });

    if (!interviewStep) {
      throw new Error('La etapa de entrevista especificada no existe');
    }

    const updatedApplication = await prisma.application.update({
      where: {
        id: application.id,
      },
      data: {
        currentInterviewStep: newStepId,
      },
      include: {
        interviewStep: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      candidateId,
      newStep: updatedApplication.interviewStep.name,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error al actualizar la etapa del candidato: ${error.message}`,
      );
    }
    throw new Error('Error al actualizar la etapa del candidato');
  }
};
