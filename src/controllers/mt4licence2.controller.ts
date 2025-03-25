import type { Request, Response } from 'express';
import { Mt4Licence2Service } from '../services/entities.services/mt4licence2.service';

const licenceService = Mt4Licence2Service.getInstance();

export const getAllLicences = async (req: Request, res: Response) => {
  try {
    const licences = await licenceService.findAll();
    res.status(200).json(licences);
  } catch (error) {
    console.error('Error fetching licences:', error);
    res.status(500).json({ message: 'Error fetching licences', error });
  }
};

export const getLicenceById = async (req: Request, res: Response) => {
  try {
    const licence = await licenceService.findById(Number(req.params.id));
    if (!licence) {
        res.status(404).json({ message: 'Licence not found' });
        return;
    }
    res.status(200).json(licence);
  } catch (error) {
    console.error('Error fetching licence:', error);
    res.status(500).json({ message: 'Error fetching licence', error });
  }
};

export const getLicencesByMT4ID = async (req: Request, res: Response) => {
  try {
    const mt4id = req.params.mt4id;
    if (!mt4id) {
        res.status(400).json({ message: 'MT4ID is required' });
        return;
    }
    const licences = await licenceService.findByMT4ID(mt4id);
    res.status(200).json(licences);
  } catch (error) {
    console.error('Error fetching licences by MT4ID:', error);
    res.status(500).json({ message: 'Error fetching licences', error });
  }
};

export const getLicenceByMT4IDAndProduct = async (req: Request, res: Response) => {
  try {
    const licence = await licenceService.findByMT4IDAndProduct(
      req.params.MT4ID || '',
      Number(req.params.productId)
    );
    if (!licence) {
        res.status(404).json({ message: 'Licence not found' });
        return;
    }
    res.status(200).json(licence);
  } catch (error) {
    console.error('Error fetching licence:', error);
    res.status(500).json({ message: 'Error fetching licence', error });
  }
};

export const createLicence = async (req: Request, res: Response) => {
  try {
        const newLicence = await licenceService.create(req.body);
        res.status(201).json(newLicence);
  } catch (error) {
    console.error('Error creating licence:', error);
    res.status(500).json({ message: 'Error creating licence', error });
  }
};

export const updateLicence = async (req: Request, res: Response) => {
  try {
    const updated = await licenceService.update(Number(req.params.id), req.body);
    if (!updated) {
        res.status(404).json({ message: 'Licence not found' });
        return;
    }
    res.status(200).json({ message: 'Licence updated successfully' });
  } catch (error) {
    console.error('Error updating licence:', error);
    res.status(500).json({ message: 'Error updating licence', error });
  }
};

export const deleteLicence = async (req: Request, res: Response) => {
  try {
    const deleted = await licenceService.delete(Number(req.params.id));
    if (!deleted) {
        res.status(404).json({ message: 'Licence not found' });
        return;
    }
    res.status(200).json({ message: 'Licence deleted successfully' });
  } catch (error) {
    console.error('Error deleting licence:', error);
    res.status(500).json({ message: 'Error deleting licence', error });
  }
};