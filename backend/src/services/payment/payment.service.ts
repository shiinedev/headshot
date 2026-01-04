import { CreditPackage, type ICreditPackage } from "@/models/CreditPackage.model";
import { NotFoundError } from "@/utils/errors";


export class PaymentService {

        //Todo: create stripe service

    async getCreditPackages():Promise<{packages: ICreditPackage[]}> {

        const packages = await CreditPackage.find({ isActive: true }).sort({ price: 1 }).exec();

        return { packages };
    }


    async getCreditPackageById(packageId: string):Promise<{package: ICreditPackage}> {

        const creditPackage = await CreditPackage.findById(packageId,{isActive: true}).exec();

        if(!creditPackage){
            throw new NotFoundError("Credit package not found");
        }

        return { package: creditPackage };
    }

}

export const paymentService = new PaymentService();